precision mediump float;

struct lightSource {
   float Ka; // Ambient reflection coefficient
   float Kd; // Diffuse reflection coefficient
   float Ks; // Specular reflection coefficient
   float shininessVal; // Shininess
   vec3 ambientColor;
   vec3 diffuseColor;
   vec3 specularColor;
   vec3 lightPos; // Spot Light position
};

varying vec3 fragNormal;
varying vec3 vertPos;
uniform lightSource light;
uniform vec3 cameraPos;

void main() {
   // Your code start from here...
   // Calculate the diffuse term
   vec3 normal = normalize(fragNormal);

   vec3 lightDir = normalize(light.lightPos - vertPos);

   float diffuseFactor = max(dot(normal, lightDir), 0.0);
   vec3 diffuse = light.Kd * diffuseFactor * light.diffuseColor;

   // Calculate the specular term 
   vec3 viewDir = normalize(cameraPos - vertPos);

   vec3 reflectDir = reflect(-lightDir, normal);

   float specularFactor = pow(max(dot(viewDir, reflectDir), 0.0), light.shininessVal);
   vec3 specular = light.Ks * specularFactor * light.specularColor;

   gl_FragColor = vec4(light.Ka * light.ambientColor + diffuse + specular, 1.0);
}