precision mediump float;
struct lightSource
{
   float Ka;   // Ambient reflection coefficient
   float Kd;   // Diffuse reflection coefficient
   float Ks;   // Specular reflection coefficient
   float shininessVal; // Shininess
   // Material color
   vec3 ambientColor;
   vec3 diffuseColor;
   vec3 specularColor;
   vec3 lightPos; // Light position
};

attribute vec3 vertPosition;
attribute vec3 vertNormal;

uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;

uniform lightSource light;
uniform vec3 cameraPos;
varying vec4 color; //color

void main()
{
   vec3 vertPos = vec3((mModel * vec4(vertPosition, 1.0)));
   // console.log(mModel);
   // console.log(mat3(mModel));
   // vec3 vertPos = mat3(transpose(inverse(mModel))) * vertPosition;

   // vec3 vertPos = (mModel * vec4(vertPosition, 1.0)).xyz;
   gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);

   vec3 N = normalize((mModel * vec4(vertNormal, 0.0)).xyz);
   vec3 L = normalize(light.lightPos - vertPos);
   // dot product of normal and light vector
   float dot_N_L = max(dot(N, L), 0.0);
   float specular = 0.0;
   if(dot_N_L > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(cameraPos - vertPos); // Vector to viewer
      // Compute the specular term
      float dot_R_V = max(dot(R, V), 0.0);
      specular = pow(dot_R_V, light.shininessVal);
   }
   color = vec4(light.Ka * light.ambientColor +
                light.Kd * dot_N_L * light.diffuseColor +
                light.Ks * specular * light.specularColor, 1.0);
}