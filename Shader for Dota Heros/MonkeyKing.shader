Shader "LightDir/Lesson11+12/MonkeyKing"
{
    Properties
    {
        [Header(Texture)] [Space(10)]
        [NoScaleOffset] _BaseColor ("RGB:颜色 A:透贴", 2D) = "white" {}
        [NoScaleOffset]_MaskTexture ("R:高光强度 G:边缘光强度 B:高光染色 A:高光次幂", 2D) = "black"{}
        [Normal] [NoScaleOffset]_NormalMap("法线贴图",2D) = "bump"{}
        [NoScaleOffset]_MatelnessMask("金属度遮罩", 2D) = "black"{}
        [NoScaleOffset]_DiffuseWrapTex("颜色Warp图",2D) = "gray"{}
        [NoScaleOffset]_FresnelTex("菲涅尔Warp图",2D) = "gray"{}
        [NoScaleOffset]_CubeMap("环境球", Cube) = "_Skybox"{}
       

        [Header(Color)] [Space(10)]
        _LightColor("光源色", Color) = (0.5,0.5,0.5,1.0)
        _EnvColor("环境光颜色",Color) = (1.0,1.0,1.0,1.0)
        [HDR]_RimColor("轮廓光颜色",Color) = (1.0,1.0,1.0,1.0)

        [Header(Power)] [Space(10)]
        _SpecPow("高光次幂",range(0.0,30)) = 5
        _SpecInt("高光强度",range(0.0,10)) = 5
        _EnvSpecInt("环境镜面反射强度", range(0.0,10.0)) = 0.5
        _RimInt("轮廓光强度",range(0.0,3.0)) = 1.0
        [HideInInspector]_CutOff("透明剪切",Range(0,1))=0.5 
        [HideInInspector]_Color("MainColor",Color) = (1.0,1.0,1.0,1.0)
    }
    SubShader
    {
        Tags {
            "RenderType"="Opaque"
        }
        Pass 
        {
            Name "FORWARD"
            Tags {
                "LightMode"="ForwardBase"
            }
            Cull Off
                CGPROGRAM
                #pragma vertex vert
                #pragma fragment frag
                #include "UnityCG.cginc"
                #include "AutoLight.cginc"  //?unity内置方法
                #include "Lighting.cginc"   //?同上
                #pragma multi_compile_fwdbase_fullshadows
                #pragma target 3.0

                // 输入参数
                uniform sampler2D _BaseColor;
                uniform sampler2D _MaskTexture;
                uniform sampler2D _NormalMap;
                uniform sampler2D _MatelnessMask;
                uniform sampler2D _DiffuseWrapTex;
                uniform sampler2D _FresnelTex;
                uniform samplerCUBE _CubeMap;
                uniform float4 _LightColor;
                uniform float _SpecPow;
                uniform float _SpecInt;
                uniform float4 _EnvColor;
                uniform float _EnvDiffInt;
                uniform half _EnvSpecInt;
                uniform half3 _RimColor;
                uniform half _RimInt;
                uniform half _CutOff;
                uniform half3 _Color;
                //输入结构
                struct VertexInput
                {
                    float2 texcoord : TEXCOORD0;
                    float3 normal : NORMAL;
                    float4 tangent : TANGENT;
                    float4 vertex : POSITION;
                };

                struct VertexOutput
                {
                    float2 uv0 : TEXCOORD0;
                    float3 nDirWS : TEXCOORD1;
                    float3 tDirWS : TEXCOORD2;
                    float3 bDirWS : TEXCOORD3;
                    float3 posWS  : TEXCOORD4; 
                    float4 pos : SV_POSITION;
                    LIGHTING_COORDS(5,6)
                };

                VertexOutput vert (VertexInput v)
                {
                    VertexOutput o;
                    o.pos = UnityObjectToClipPos(v.vertex);
                    o.uv0 = v.texcoord;                
                    o.posWS  = mul(unity_ObjectToWorld,v.vertex);
                    o.nDirWS = UnityObjectToWorldNormal(v.normal);  //变换法线信息，并将其塞给输出结构
                    o.tDirWS = normalize(mul(unity_ObjectToWorld, float4(v.tangent.xyz, 0.0)).xyz); // 切线方向 OS>WS
                    o.bDirWS = normalize(cross(o.nDirWS, o.tDirWS) * v.tangent.w);
                    TRANSFER_VERTEX_TO_FRAGMENT(o)                  //?Unity封装 不用管细节
                    return o;
                }

                fixed4 frag (VertexOutput i) : SV_Target
                {
                    //向量准备
                    half3 nDirTS = UnpackNormal(tex2D(_NormalMap, i.uv0));
                    half3x3 TBN = float3x3(i.tDirWS, i.bDirWS, i.nDirWS);
                    half3 nDirWS = normalize(mul(nDirTS,TBN));
                    half3 vDirWS = normalize(_WorldSpaceCameraPos.xyz-i.posWS.xyz);
                    half3 vrDirWS = reflect(-vDirWS,nDirWS);
                    half3 lDir = _WorldSpaceLightPos0.xyz;
                    half3 rDir = reflect(-lDir, nDirWS);
                    //中间量准备
                    half rdotv = dot(rDir,vDirWS);
                    half ndotl = dot(lDir, nDirWS);
                    half vdotn = dot(vDirWS, nDirWS);
                    //纹理采样
                    half4 var_MainTexure = tex2D(_BaseColor, i.uv0);
                    half4 var_MaskTexture = tex2D(_MaskTexture, i.uv0);
                    half3 var_fresnelMask = tex2D(_FresnelTex,i.uv0).rgb;
                    half var_MatelnessMask = tex2D(_MaskTexture,i.uv0).r;
                    half3 var_Cubemap = texCUBElod(_CubeMap,float4(vrDirWS,lerp(8.0,0.0,var_MaskTexture.a))).rgb;
                    //信息提取
                    half3 baseColor = var_MainTexure.rgb;
                    half opacity = var_MainTexure.a;
                    half specInt = var_MaskTexture.r;
                    half rimInt = var_MaskTexture.g;
                    half specTint = var_MaskTexture.b;
                    half specPow = var_MaskTexture.a;
                    half matelness = var_MatelnessMask;
                    half3 envCube = var_Cubemap;
                    half shadow = LIGHT_ATTENUATION(i);
                    //光照模型
                        //漫反射颜色，镜面反射颜色
                        half3 diffuseCol = lerp(baseColor,half3(0,0,0),matelness);
                        half3 specCol = lerp(baseColor,half3(0.3,0.3,0.3),specInt)*specInt;
                        //菲涅尔
                        half3 fresnel = lerp(var_fresnelMask, 0.0, matelness);
                        half fresnelCol = fresnel.r;
                        half fresnelRim = fresnel.g;//轮廓光
                        half fresnelSpec = fresnel.b;//镜面反射
                        //光源漫反射
                        half halflambert = ndotl*0.5+0.5;
                        half3 var_DiffuseWarpTex = tex2D(_DiffuseWrapTex,half2(halflambert,0.2));
                        half3 dirDiff = diffuseCol*var_DiffuseWarpTex*_LightColor;
                        //光源镜面反射
                        half phong = pow(max(0.0, rdotv),_SpecPow*specPow);
                        half spec = phong*max(0.0,ndotl);
                        spec = max(spec,fresnelSpec);
                        spec = spec*_SpecInt;
                        half3 dirSpec = specCol*spec*_LightColor;
                        //环境漫反射
                        half3 envDiff = diffuseCol*_EnvColor;
                        //环境镜面反射
                        half reflectInt = max(fresnelSpec, matelness)*specInt;
                        half3 envspec = specCol*reflectInt*envCube*_EnvSpecInt;
                        //轮廓光
                        half3 rimLight = _RimColor*_RimInt*fresnelRim*rimInt*max(0.0,nDirWS.g);
                        //最终混合
                        half3 finalRGB = (dirDiff+dirSpec)*shadow+envDiff+envspec+rimLight;
                        clip(opacity - _CutOff);
                    //返回值
                    return float4(finalRGB,1.0);
                }
                ENDCG
            }
        }
        FallBack "Legacy Shaders/Transparent/Cutout/VertexLit"
    }
