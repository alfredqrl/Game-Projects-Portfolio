# -*- coding: utf-8 -*-

import os
import numpy as np



class interpolation(object):
    def linear_interpolation(self, x, x0, x1, y0, y1):
        if x0 == x1:
            return y0
        else:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)


    def bilinear_interpolation(self):
        interpolated_pix = None

        return interpolated_pix
