# Rendering Different Shadings for Three Teapots
## 1. Usage
- Open this whole folder using Visual Studio Code
- Install Live Server Extension
- Open the Live Server
## 2. Findings when implementating this project
1. The rotation changes from three teapots fixed in each position and rotating around their central 
point specifically to three teapots rotating around the central teapot. The reason should be the 
order of rotation and translation. The original order is: 1. Rotate the model around the y-axis by 
the specified angle. 2. Translate the model along the x-axis by the specified offset. The 
translation will be applied before the rotation when the order is changed. This means the model 
will be translated along the x-axis first and then rotated around the y-axis. The resulting 
transformation will be different, and the teapot's rotation pattern will be changed accordingly

2. Phong shading provides more accurate and detailed shading, including specular highlights and 
reflections. Gouraud shading produces smooth shading but can be less accurate, especially for 
rapidly changing lighting conditions or large triangles. Gouraud shading is computationally more 
straightforward and faster to render than Phong Shading because it calculates lighting per 
vertex and interpolates values across triangles. Phong shading requires lighting calculations 
per pixel, making it more computationally intensive and slower to render