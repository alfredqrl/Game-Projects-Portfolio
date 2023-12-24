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
attribute vec2 vertTexCoord;
attribute vec3 vertNormal;

uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;

uniform lightSource light;
uniform vec3 cameraPos;
varying vec4 color; //color

void main()
{
   gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);

   // Your code start from here...
   // calculate the diffuse term
   vec3 normalDiffuse = normalize(mat3(mModel) * vertNormal);
   
   vec3 drLight = normalize(light.lightPos - vec3(mModel * vec4(vertPosition, 1.0)));

   float diffuseFactor = max(dot(normalDiffuse, drLight), 0.0);
   vec3 diffuse = light.Kd * diffuseFactor * light.diffuseColor;
   // Calculate the specular term
   
   vec3 dirView = normalize(cameraPos - vec3(mModel * vec4(vertPosition, 1.0)));

 
   vec3 reflectDir = reflect(-drLight, normalDiffuse);

  
   float specularFactor = pow(max(dot(dirView, reflectDir), 0.0), light.shininessVal);
   vec3 specular = light.Ks * specularFactor * light.specularColor;


   color = vec4(light.Ka * light.ambientColor + diffuse + specular, 1.0);
}