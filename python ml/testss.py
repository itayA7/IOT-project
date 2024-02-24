import json
import os
import numpy as np
from dtw import dtw
import sys

sys.path.append(r'C:\Users\itaya\AppData\Local\Programs\Python\Python310\Lib\site-packages')

def load_keypoints_from_json(file_path):
    with open(file_path, 'r') as file:
        keypoints_data = json.load(file)
    return keypoints_data


def manhattan_distance(x, y):
    return np.sum(np.abs(x - y))

def euclidean_distance(x, y):
    return np.sqrt(np.sum((x - y)**2))

def calculate_dtw_distance(seq1, seq2):
    distance, _, _, _ = dtw(seq1, seq2, dist=euclidean_distance)
    return distance


def l2_normalize(vector):   
    vector = np.array(vector)
    norm = np.linalg.norm(vector, ord=2)  # Calculate L2 norm
    normalized_vector = vector / norm if norm != 0 else vector  # Perform normalization, avoid division by zero
    return normalized_vector


def main(directory_path):
    input_keypoints = json.loads(sys.stdin.read())
    min_dtw_distances = {}
    # Extract unique part numbers
    part_numbers = set(point['part'] for point in input_keypoints[0])

    # Initialize minimum DTW distances for each part
    for part_num in part_numbers:
        min_dtw_distances[part_num] = float('inf')

    # Preprocess input keypoints data
    input_sequences = {}
    for part_num in part_numbers:
        input_sequences[part_num] = []
        for point in input_keypoints:
            for point_data in point:
                if point_data['part'] == part_num:
                    input_sequences[part_num].append([point_data['position']['x'], point_data['position']['y']])

    # L2 normalize input sequences
    input_sequences_normalized = {}
    for part_num in part_numbers:
        input_sequences_normalized[part_num] = l2_normalize(input_sequences[part_num])

    # Iterate over files in the directory
    for file_name in os.listdir(directory_path):
        if file_name.endswith('.json'):
            file_path = os.path.join(directory_path, file_name)
            keypoints_data = load_keypoints_from_json(file_path)

            # Preprocess file keypoints data
            file_sequences = {}
            for part_num in part_numbers:
                file_sequences[part_num] = []
            for point in keypoints_data:
                for point_data in point:
                    part_num = point_data['part']
                    if part_num in part_numbers:
                        file_sequences[part_num].append([point_data['position']['x'], point_data['position']['y']])

            # L2 normalize file sequences
            file_sequences_normalized = {}
            for part_num in part_numbers:
                file_sequences_normalized[part_num] = l2_normalize(file_sequences[part_num])



            # Calculate DTW distances for each part
            for part_num in part_numbers:
                input_sequence = np.array(input_sequences_normalized[part_num])
                file_sequence = np.array(file_sequences_normalized[part_num])

                dtw_distance = calculate_dtw_distance(input_sequence, file_sequence)

                # Update the minimum DTW distance if necessary
                if dtw_distance < min_dtw_distances[part_num]:
                    min_dtw_distances[part_num] = dtw_distance

     

    result = {
        'min_dtw_distances': min_dtw_distances
    }
    print(json.dumps(result))


if __name__ == "__main__":
    exc_number_from_node = sys.argv[1]
    input_file_path = 'keypoints_json/bad_test.json'
    directory_path = 'E:/מכללה/IOT/final project-2024/python ml/keypoints_json/exc'+str(exc_number_from_node)
    main(directory_path)
