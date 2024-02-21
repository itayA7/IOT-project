import cv2
# Function to extract frames
def FrameCapture(path):
    vidObj = cv2.VideoCapture(path)
    count = 0
    success =True
    while success:
        success, image = vidObj.read()
        if(count%12==0):
            cv2.imwrite("frames/exc1/actor2_3/frame%d.png" % count, image)
        count += 1
    vidObj.release()  # Release the video object


if __name__ == '__main__':
    # Calling the function
    FrameCapture("./HTPE Dataset MP4/Actor 2/Ac2_Eg1_R3_C.mp4")