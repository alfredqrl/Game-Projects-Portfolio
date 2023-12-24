# Image Processing for VRAR Systems
## 1. Project Description
1. Distortion
    - Simple Distortion
    - Barrel Distortion
    - Inverse Distortion with/without linear/bilinear interpolation
2. Boundary Blur
3. Disparity Map Generation
## 2. Usage
- Open the Image Processing for VRAR Systems ipynb file and run
- Make sure you have these packages installed
`import os
import cv2
import math
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from skimage.draw import ellipse
from scipy.signal import convolve2d
from pylab import *
from scipy.ndimage import *`