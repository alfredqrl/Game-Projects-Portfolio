Shader "LightDir/L21+Creative/Shield"
{
    Properties {
        [Header(Texture)]
        _MainTex ("MainTex", 2D) = "white" {}                    
        _ShieldTex ("ShieldTex", 2D) = "white" {}   
        _NoiseTex("NoiseTex", 2D) = "white" {}
        [Header(Color)]
        [HDR]_OutColor ("OutColor", Color) = (1,1,1,1)                    //控制每一个蜂巢网格的边缘光颜色
        [HDR]_SweepColor ("SweepColor", Color) = (1,1,1,1)                    //控制每一个蜂巢网格的主体颜色
        [HDR]_FresnelColor ("FresnelColor", Color) = (1,1,1,1)        //控制防护罩的边缘高光颜色            
        [HDR]_DepthColor ("DepthColor", Color) = (1,1,1,1)
        [Header(data)]
        _DepthWidth("_DepthWidth",Range(0.1,10)) = 1
        _FresnelPower ("FresnelPower", Range(0.1, 11)) = 1            //控制防护罩的边缘高光强度        
        _FresnelAlpha ("FresnelAlpha", Range(0, 50)) = 1            //控制防护罩的不透明度
        _AlphaPow("_AlphaPow",Range(0,1))=1                         //控制流光Alpha值
        _OffsetFactor ("OffsetFactor", Float) = 0.0001                //控制网格偏移程度
        _RollSpeed ("RollSpeed", Range(0, 5)) = 1                    //控制滚动速度
        _TimeControl("TimeControl",vector) =(1,1,1,1)
        _Step_Up("Step_Up",Range(0,1)) = 1
    }
    SubShader {
        Tags {
            "Queue"="Transparent"               // 调整渲染顺序
            "RenderType"="Transparent"    // 对应改为Cutout
            "IgnoreProjector" = "True"
            // "ForceNoShadowCasting"="True"       // 关闭阴影投射
            // "IgnoreProjector"="True"            // 不响应投射器
            
        }
        Pass {
            Name "FORWARD"
            Tags {
                "LightMode"="ForwardBase"
            }
            Blend SrcAlpha OneMinusSrcAlpha          // 修改混合方式One/SrcAlpha OneMinusSrcAlpha
            //如果是SrcAlpha会更暗一些，WM在下面会再重新乘一遍Alpha
            
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            #pragma multi_compile_fwdbase_fullshadows
            #pragma target 3.0

            //输入参数
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
            uniform sampler2D _ShieldTex;
            uniform sampler2D _NoiseTex;
            uniform half4 _OutColor;
            uniform half4 _SweepColor;
            uniform half4 _FresnelColor;
            uniform half4 _DepthColor;
            uniform half _DepthWidth;
            uniform half _FresnelPower;
            uniform half _FresnelAlpha;
            uniform half _OffsetFactor;
            uniform half _RollSpeed;
            uniform half _AlphaPow;
            uniform half4 _TimeControl;
            uniform half _Step_Up;
            uniform sampler2D _CameraDepthTexture;
            //输入结构
            struct VertexInput {
                float4 vertex : POSITION;//输入模型的顶点信息
                float2 uv0 : TEXCOORD0;
                float2 uv1 : TEXCOORD1;
                float2 uv2 : TEXCOORD2;
                float3 normal:NORMAL;

            };
            //输出结构
            struct VertexOutput {
                float4 pos : SV_POSITION;//由模型的顶点信息换算来的顶点屏幕位置
                float2 uv0 : TEXCOORD0;
                float2 uv1 : TEXCOORD1;
                float2 uv2 : TEXCOORD2;
                float3 pDirWS: TEXCOORD3;
                float3 nDirWS: TEXCOORD4;
                float4 projPos : TEXCOORD5;
            };
            //输入结构>>>顶点Shader>>>输出结构
            VertexOutput vert (VertexInput v) {
                VertexOutput o; //新建一个输出结构
                float2 uv = v.normal.xy*0.5+0.5;
                uv = TRANSFORM_TEX(uv,_MainTex);
                o.uv2 = uv*_TimeControl.xy*_Time.y+_TimeControl.zw;
                uv.y += _Time.y*_RollSpeed;
                half3 offset = tex2Dlod(_MainTex,half4(uv.x,uv.y,0,0));
                offset = smoothstep(0,1,offset);
                v.vertex.xyz += normalize(v.normal)*(offset*_OffsetFactor*0.001);
                o.pos = UnityObjectToClipPos( v.vertex );//变换顶点信息 并将其塞给输出结构
                o.uv0 = uv;
                o.uv1 = v.uv0;
                o.nDirWS = normalize(UnityObjectToWorldNormal(v.normal));
                o.pDirWS = mul(unity_ObjectToWorld,v.vertex).xyz;
                o.projPos = ComputeScreenPos(o.pos);
                COMPUTE_EYEDEPTH(o.projPos.z);
                return o;                                  //返回输出结构 输出
            }
            //输出结构>>>像素
            half4 frag(VertexOutput i, float facing:VFACE) : SV_Target {
                half isFrontFace = ( facing >= 0 ? 1 : 0 );
                half faceSign = ( facing >= 0 ? 1 : -1 );
                half sceneZ = max(0,LinearEyeDepth (UNITY_SAMPLE_DEPTH(tex2Dproj(_CameraDepthTexture, UNITY_PROJ_COORD(i.projPos)))) - _ProjectionParams.g);
                half partZ = max(0,i.projPos.z - _ProjectionParams.g);
                half normalizedStep = saturate((sceneZ-partZ)/_DepthWidth);

                half4 Mask = tex2D(_NoiseTex,i.uv2);//b为Noise
                half4 var_MainTex = tex2D(_MainTex,i.uv0);

                half nDotv = 1-dot(i.nDirWS,normalize(UnityWorldSpaceViewDir(i.pDirWS)));
                half fresnel = pow(nDotv,_FresnelPower);
                half3 fresnelCol = fresnel*_FresnelColor+_FresnelColor*Mask.g;
                
                half3 sCol = tex2D(_ShieldTex,i.uv1)*_OutColor.rgb;
                half3  col= var_MainTex.r*_SweepColor;
                
                half3 lerpCol = lerp(_DepthColor.rgb,fresnelCol+sCol,normalizedStep);
                
                half pause = saturate(step(i.nDirWS.y,(_Step_Up-0.5)*2));

                half3 finalCol = lerpCol*(1-var_MainTex.r)+col;
                half colAlpha = var_MainTex.a*_AlphaPow;

                return half4(finalCol, (pow(nDotv, _FresnelAlpha)+colAlpha)*pause);
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}