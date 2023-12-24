Shader "LightDir/Lesson9+10/FakePBR_HLSL"
{
    Properties
    {
        [Header(Texture)]
        _NormalMap  ("NormalMap"  , 2D) = "bump"{}
        _DiffuseColor("DiffuseColor",2D) = "white"{}
        _AO("AO", 2D) = "white"{}
        _Emissive("Emissive", 2D) = "black"{}
        _CubeMap("CubeMap", Cube) = "_Skybox"{}
        _SpecTex("SpecTex", 2D)="gray"{}

        _SpecularPow("SpecularPow", Range(0,90)) = 10
        _EnvInt ("EnvInt", Range(0,1)) = 0.0
        _EnvSpecInt ("EncSpecInt", Range(0,5)) = 0.0
        _CubeMapMit ("CubeMapMit", Range(0,7)) = 0.0
        _FresnelPow("FresnelPow", Range(0,10)) = 1.0
        _LightColor ("LightColor", Color) = (0.5, 0.5, 0.5, 1.0)
        _UpColor ("UpColor", Color) = (0.5, 0.5, 0.5, 1.0)
        _MidColor ("MidColor", Color) = (0.5, 0.5, 0.5, 1.0)
        _DownColor ("DownColor", Color) = (0.5, 0.5, 0.5, 1.0)
        [Header(Emission)]
            [HideInInspect] _EmitInt    ("自发光强度", range(1, 10))         = 1

    }
    SubShader {
        Tags {
            "RenderType"="Opaque"
        }
        Pass {
            Name "FORWARD"
            Tags {
                "LightMode"="ForwardBase"
            }
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            #include "AutoLight.cginc"  //?unity内置方法
            #include "Lighting.cginc"   //?同上
            #pragma multi_compile_fwdbase_fullshadows
            #pragma target 3.0
            
            //*输入参数
            uniform sampler2D _NormalMap;
            uniform sampler2D _DiffuseColor;
            uniform sampler2D _AO;
            uniform sampler2D _Emissive;
            uniform samplerCUBE _CubeMap;
            uniform float _SpecularPow;
            uniform float _EnvInt;
            uniform float _EnvSpecInt;
            uniform float _CubeMapMit;
            uniform float _FresnelPow;
            uniform float4 _LightColor;
            uniform float4 _UpColor;
            uniform float4 _MidColor;
            uniform float4 _DownColor;
            uniform float _EmitInt;


            //*输入结构
            struct VertexInput {
                float4 tangent :TANGENT; 
                float4 vertex : POSITION;                       //输入模型的顶点信息
                float3 normal : NORMAL;                         //输入模型的法线信息
                float2 uv0    : TEXCOORD0;                      //将模型UV信息输入进来 0通道 共4通道
            };
            //*输出结构
            struct VertexOutput {
                float4 pos    : SV_POSITION;                    //由模型的顶点信息换算来的顶点屏幕位置
                float2 uv0    : TEXCOORD0;                      //追加uv信息用于像素shader采样贴图
                float4 posWS  : TEXCOORD1;
                float3 nDirWS : TEXCOORD2;                      //由模型法线信息换算来的世界空间法线信息
                float3 tDirWS : TEXCOORD3;
                float3 bDirWS : TEXCOORD4;
                LIGHTING_COORDS(5,6)                            //?后面的3和4是跟在TEXCOORD0,1,2后面，不占用0，1，2的贴图信息
            };

            //*输入结构>>>顶点Shader>>>输出结构
            VertexOutput vert (VertexInput v) {
                VertexOutput o = (VertexOutput)0;               //新建一个输出结构
                o.pos = UnityObjectToClipPos( v.vertex );       //变换顶点信息 并将其塞给输出结构
                o.uv0=v.uv0;
                o.posWS  = mul(unity_ObjectToWorld,v.vertex);
                o.nDirWS = UnityObjectToWorldNormal(v.normal);  //变换法线信息，并将其塞给输出结构
                o.tDirWS = normalize(mul(unity_ObjectToWorld, float4(v.tangent.xyz, 0.0)).xyz); // 切线方向 OS>WS
                o.bDirWS = normalize(cross(o.nDirWS, o.tDirWS) * v.tangent.w);
                TRANSFER_VERTEX_TO_FRAGMENT(o)                  //?Unity封装 不用管细节
                return o;                                       //返回输出结构 输出
            }
            
            //*输出结构>>>像素
            float4 frag(VertexOutput i) : COLOR 
            {
                //*贴图采样
                float3 diffuseColor = tex2D(_DiffuseColor, i.uv0).rgb;
                float3 AO = tex2D(_AO, i.uv0).g;
                float3 var_EmitTex = tex2D(_Emissive,i.uv0);
               //*准备向量
                float3 nDirTS = UnpackNormal(tex2D(_NormalMap, i.uv0)).rgb;
                float3x3 TBN = float3x3(i.tDirWS, i.bDirWS, i.nDirWS);
                float3 nDirWS = normalize(mul(nDirTS, TBN));        // 计算nDirVS 计算Fresnel
                float3 vDirWS = normalize(_WorldSpaceCameraPos.xyz - i.posWS.xyz); // 计算Fresnel
                float3 vrDirWS = reflect(-vDirWS,nDirWS);
                float3 lDir = _WorldSpaceLightPos0.xyz;
                float3 rDir   = reflect (-lDir,nDirWS);
               //*准备中间变量
               float rdotv = dot(rDir, vDirWS);
               float vdotn = dot(vDirWS, nDirWS);
               float ndotl = dot(lDir,nDirWS);
               //*光照模型
               float shadow = LIGHT_ATTENUATION(i);
               float lambert = max(0.0,ndotl);
               float Phong = pow(max(0.0, rdotv), _SpecularPow);
               float3 dirLighting = (diffuseColor*lambert + Phong ) * shadow * _LightColor;

               //环境光影响
                float3 upColor = max(0.0, nDirWS.g)*_UpColor;
                float3 downColor = max(0.0, -nDirWS.g)*_DownColor;
                float3 midColor = (1-upColor-downColor)*_MidColor;
                float3 envColor = (upColor+downColor+midColor)*_EnvInt;

                //CubeMap
                float3 cubeMap = texCUBElod(_CubeMap, float4(vrDirWS, _CubeMapMit));
                float fresnel = pow(max(0.0,1-vdotn),_FresnelPow);
                float3 cubemapEnvSpecular = cubeMap*fresnel*_EnvSpecInt;
                
                float3 envSpecLighting = (cubemapEnvSpecular+envColor)*AO+dirLighting;

                float3 emission = var_EmitTex*_EmitInt*(sin(_Time.z)*0.5+0.5);

               //返回值
                return float4(envSpecLighting+emission, 1.0);    //输出最终颜色
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}

