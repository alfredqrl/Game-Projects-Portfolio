precision mediump float;

struct lightSource
{
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

void main()
{
   vec3 N = normalize(fragNormal);
   vec3 L = normalize(light.lightPos - vertPos);

   // Lambert's cosine law
   float lambertian = max(dot(N, L), 0.0);
   float specular = 0.0;
   if(lambertian > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(cameraPos - vertPos); // Vector to viewer
      // Compute the specular term
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, light.shininessVal);
   }
   gl_FragColor = vec4(light.Ka * light.ambientColor +
                       light.Kd * lambertian * light.diffuseColor +
                       light.Ks * specular * light.specularColor, 1.0);
}