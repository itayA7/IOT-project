import json
import os
from dtw import dtw
import sys

sys.path.append(r'C:\Users\itaya\AppData\Local\Programs\Python\Python310\Lib\site-packages')

def load_keypoints_from_json(file_path):
    with open(file_path, 'r') as file:
        keypoints_data = json.load(file)
    return keypoints_data

def calculate_dtw_distance(seq1, seq2):
    distance, _, _, _ = dtw(seq1, seq2, dist=lambda x, y: abs(x - y))
    return distance

def main(directory_path):
    input_keypoints = json.loads(sys.stdin.read())


    min_dtw_distances = {}

    for sequence in input_keypoints:
        for point in sequence:
            part = point['part']
            x = point['position']['x']
            y = point['position']['y']

            if part not in min_dtw_distances:
                min_dtw_distances[part] = float('inf')

            for file_name in os.listdir(directory_path):
                if file_name.endswith('.json'):
                    file_path = os.path.join(directory_path, file_name)
                    keypoints_data = load_keypoints_from_json(file_path)
                    for sequence_data in keypoints_data:
                        for point_data in sequence_data:
                            if point_data['part'] == part:
                                x2 = point_data['position']['x']
                                y2 = point_data['position']['y']
                                dtw_distance = calculate_dtw_distance([x, y], [x2, y2])
                                if dtw_distance < min_dtw_distances[part]:
                                    min_dtw_distances[part] = dtw_distance
    result = {
        'min_dtw_distances': min_dtw_distances
    }
    print(json.dumps(result))

if __name__ == "__main__":
    exc_number_from_node = sys.argv[1]
    directory_path = 'E:/מכללה/IOT/final project-2024/python ml/keypoints_json/exc'+str(exc_number_from_node)  # Update with your directory path
    main(directory_path)
