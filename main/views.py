from django.shortcuts import render,HttpResponse,redirect
from sites.settings import BASE_DIR
import imutils
from imutils import contours
from scipy.spatial import distance as dist
from imutils import perspective
import cv2
import numpy as np
from skimage import io, color
from itertools import chain
from keras import backend as K
import json
import os
import sys
import math
import re
import time
import numpy as np
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, r"main\Mask_RCNN_master"))
import tensorflow as tf
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from mrcnn import utils
from mrcnn import visualize
from mrcnn.visualize import display_images
import mrcnn.model as modellib
from mrcnn.model import log
from main.Mask_RCNN_master.samples.balloon import balloon
from skimage import filters 
from skimage import data 
import skimage
from imutils import contours
from scipy.spatial import distance as dist
from imutils import perspective
import imutils
from imutils import contours
from scipy.spatial import distance as dist
from imutils import perspective
from django.core.files.storage import FileSystemStorage
import base64
from skimage.measure import find_contours
import random
import itertools
import colorsys
import numpy as np
from skimage.measure import find_contours
from matplotlib import patches,  lines
from matplotlib.patches import Polygon
import IPython.display


def apply_mask(image, mask, color, alpha=0.5):

    for c in range(3):
        image[:, :, c] = np.where(mask == 1,
                                  image[:, :, c] *
                                  (1 - alpha) + alpha * color[c] * 255,
                                  image[:, :, c])
    return image

def random_colors(N, bright=True):

    brightness = 1.0 if bright else 0.7
    hsv = [(i / N, 1, brightness) for i in range(N)]
    colors = list(map(lambda c: colorsys.hsv_to_rgb(*c), hsv))
    random.shuffle(colors)
    return colors

def display_instances(image, boxes, masks, class_ids, class_names,
                      scores=None, title="",
                      figsize=(16, 16), ax=None,
                      show_mask=True, show_bbox=True,
                      colors=None, captions=None):
    N = boxes.shape[0]
    if not N:
        print("\n*** No instances to display *** \n")
    else:
        assert boxes.shape[0] == masks.shape[-1] == class_ids.shape[0]
    auto_show = False
    if not ax:
        _, ax = plt.subplots(1, figsize=figsize)
        auto_show = True

    # Generate random colors
    colors = colors or random_colors(N)

    # Show area outside image boundaries.
    height, width = image.shape[:2]
    ax.set_ylim(height + 10, -10)
    ax.set_xlim(-10, width + 10)
    ax.axis('off')
    ax.set_title(title)

    masked_image = image.astype(np.uint32).copy()
    for i in range(N):
        color = colors[i]
        if not np.any(boxes[i]):
            continue
        y1, x1, y2, x2 = boxes[i]
        if show_bbox:
            p = patches.Rectangle((x1, y1), x2 - x1, y2 - y1, linewidth=2,
                                alpha=0.7, linestyle="dashed",
                                edgecolor=color, facecolor='none')
            ax.add_patch(p)

        if not captions:
            class_id = class_ids[i]
            score = scores[i] if scores is not None else None
            label = class_names[class_id]
            caption = "{} {:.3f}".format(label, score) if score else label
        else:
            caption = captions[i]
        ax.text(x1, y1 + 8, caption,
                color='w', size=11, backgroundcolor="none")
        mask = masks[:, :, i]
        if show_mask:
            masked_image = apply_mask(masked_image, mask, color)

        padded_mask = np.zeros(
            (mask.shape[0] + 2, mask.shape[1] + 2), dtype=np.uint8)
        padded_mask[1:-1, 1:-1] = mask
        contours = find_contours(padded_mask, 0.5)
        for verts in contours:
            verts = np.fliplr(verts) - 1
            p = Polygon(verts, facecolor="none", edgecolor=color)
            ax.add_patch(p)
    return masked_image.astype(np.uint8)



def H_W(IMAGE_NAME):
    im_gray = cv2.imread(IMAGE_NAME,cv2.IMREAD_GRAYSCALE)
    h,w = im_gray.shape[:2]
    return w,h

def center_finder(r):
    x_center = []
    y_center = []
    for i in range(len(r['rois'])):
        x_center.append((r['rois'][i][0]+r['rois'][i][2])/2)
        y_center.append((r['rois'][i][1]+r['rois'][i][3])/2)
    return x_center,y_center
def WallsCordinates(temp1):
    h,w = temp1.shape[:2]
    for i in range(h):
        for j in range(w):
            if(temp1[i,j] < 255):
                temp1[i,j]=0
    contours,hierarchy = cv2.findContours(temp1, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    points = {}
    count = 0
    kx= []
    ky= []
    x = []
    y = []
    for k in range(1,len(contours)):
        cnts = contours[k]
        epsilon = 0.001*cv2.arcLength(cnts,True)
        approx = cv2.approxPolyDP(cnts,epsilon,True)
        for j in range(0,len(approx)):
            kx.append(approx[j][:,0][0])
            ky.append(approx[j][:,1][0])
        kx = np.array(kx)
        ky = np.array(ky)
        points.update({str(count):{'X':kx.tolist(),'Y':ky.tolist()}})
        count+=1
        kx = []
        ky = []
    return points
    
def home(request):
    if request.FILES.get('floor_plan', False):
        uploaded_file = request.FILES['floor_plan']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name,uploaded_file)
        url = fs.url(name)
    else:
        return redirect('./')
    fs = FileSystemStorage()
    url = fs.url(request.FILES['floor_plan'].name)
    directory = os.path.join(BASE_DIR,url)
    MODEL_DIR = os.path.join(ROOT_DIR, "logs/mask_rcnn_wall_0053.h5")
    config = balloon.BalloonConfig()
    BALLOON_DIR = os.path.join(ROOT_DIR, "samples/balloon/dataset/")
    class InferenceConfig(config.__class__):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1
        NUM_CLASSES = 1 + 1


    config = InferenceConfig()
    config.display()
    DEVICE = "/gpu:0" 
    TEST_MODE = "inference"
    K.clear_session()
    with tf.device(DEVICE):
        model = modellib.MaskRCNN(mode="inference", model_dir=MODEL_DIR,
                                  config=config)
    model.load_weights(MODEL_DIR, by_name=True)
    class_names = ['BG', 'wall']
    
    image = skimage.io.imread(directory)
    results = model.detect([image], verbose=1)
    K.clear_session()
    r = results[0]
    mask = r['masks']
    mask = mask.astype(int)
    temp = skimage.io.imread(directory)
    temp1 = np.full((temp.shape[0],temp.shape[1],temp.shape[2]),255,dtype=np.uint8)  
    h,w = temp1.shape[:2]
    for i in range(mask.shape[2]):
        masked = mask[:,:,i]
        for j in range(3):
            temp1[:, :, j] = np.where(masked == 1,
                                      temp[:, :, j],
                                      temp1[:,:,j])

    temp1 = cv2.cvtColor(temp1, cv2.COLOR_BGR2GRAY)
    kernel1 = np.ones((4, 4), np.uint8) 
    temp1 = cv2.dilate(temp1, kernel1, iterations=1)
    
    points = WallsCordinates(temp1)
    points = json.dumps(points)
    image1 = display_instances(image, r['rois'], r['masks'], r['class_ids'], class_names, r['scores'])
    image1 = base64.b64encode(cv2.imencode('.jpg', image1)[1]).decode('utf-8')
    image = base64.b64encode(cv2.imencode('.jpg', temp1)[1]).decode('utf-8')

    #for WC 

    directory = os.path.join(BASE_DIR,url)
    MODEL_DIR = os.path.join(ROOT_DIR, "logs/mask_rcnn_wc_0047.h5")
    config = balloon.BalloonConfig()
    BALLOON_DIR = os.path.join(ROOT_DIR, "samples/balloon/dataset/")
    class InferenceConfig(config.__class__):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1
        NUM_CLASSES = 1 + 4
    config = InferenceConfig()
    config.display()
    DEVICE = "/gpu:0" 
    TEST_MODE = "inference"
    K.clear_session()
    with tf.device(DEVICE):
        model = modellib.MaskRCNN(mode="inference", model_dir=MODEL_DIR,
                                  config=config)
    model.load_weights(MODEL_DIR, by_name=True)
    class_names = ['BG','Wc_left','Wc_right','Wc_top','Wc_bottom']

    
    image = skimage.io.imread(directory)
    results = model.detect([image], verbose=1)
    K.clear_session()
    r = results[0]
    x_center = []
    y_center = []
    x_center,y_center = center_finder(r)

    

    # for Sink

    directory = os.path.join(BASE_DIR,url)
    MODEL_DIR = os.path.join(ROOT_DIR, "logs/mask_rcnn_sink_0026.h5")
    config = balloon.BalloonConfig()
    BALLOON_DIR = os.path.join(ROOT_DIR, "samples/balloon/dataset/")
    class InferenceConfig(config.__class__):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1
        NUM_CLASSES = 1 + 1
    config = InferenceConfig()
    config.display()
    DEVICE = "/gpu:0" 
    TEST_MODE = "inference"
    K.clear_session()
    with tf.device(DEVICE):
        model = modellib.MaskRCNN(mode="inference", model_dir=MODEL_DIR,
                                  config=config)
    model.load_weights(MODEL_DIR, by_name=True)
    class_names = ['BG','sink']
    image = skimage.io.imread(directory)
    results = model.detect([image], verbose=1)
    K.clear_session()
    r = results[0]
    sinkx_center = []
    sinky_center = []
    sinky_center,sinkx_center = center_finder(r)


    args = {'walls':points,'H':h,'W':w,'img1':image,'img2':image1,'x_center':x_center,'y_center':y_center,'sink_x':sinkx_center,'sink_y':sinky_center}

    return render(request, "libs/chapter-01/01.05-controls.html",args)



def upload(request):
    return render(request,"UploadPage/upload.html") 








