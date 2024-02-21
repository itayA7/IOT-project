import json
import os
import sys
from dtw import dtw

sys.path.append(r'C:\Users\itaya\AppData\Local\Programs\Python\Python310\Lib\site-packages')


def load_keypoints_from_json(file_path):
    with open(file_path, 'r') as file:
        keypoints_data = json.load(file)
    return keypoints_data


def l2_normalize_sequence(seq):
    squared_sum = sum(x * x for x in seq)
    l2_norm = squared_sum ** 0.5 if squared_sum != 0 else 1.0
    normalized_seq = [x / l2_norm for x in seq]
    return normalized_seq


def flatten_positions(poses):
    flat_coords = []
    for pose in poses:
        for part in pose:
            flat_coords.append(part['position']['x'])
            flat_coords.append(part['position']['y'])
    return flat_coords


def calculate_dtw_distance(seq1, seq2):
    distances = []
    for i in range(0, len(seq1), 2):
        part_seq1 = seq1[i:i + 2]
        part_seq2 = seq2[i:i + 2]
        distance, _, _, _ = dtw(part_seq1, part_seq2, dist=euclidean_distance)
        distances.append(distance)
    return distances


def euclidean_distance(x, y):
    return abs(x - y)


def prepareFile(file_path):
    positions_seq = load_keypoints_from_json(file_path)
    flat_positions_seq = flatten_positions(positions_seq)
    normalized_seq = l2_normalize_sequence(flat_positions_seq)
    return normalized_seq


def avg(r):
    sum = 0
    for i in r:
        sum = sum + i
    return (sum / len(r))

def read_json_from_file(file_path):
    with open(file_path, 'r') as file:
        json_data = json.load(file)
    return json_data


def main(exc_number):
    #jsonData = json.loads(sys.stdin.read())
    json_file_path = 'keypoints_json/exc1/AC5_E1_6.json'
    jsonData = read_json_from_file(json_file_path)

    path = 'E:\מכללה\IOT/final project-2024\python ml\keypoints_json\exc' + str(exc_number)
    dir_list = os.listdir(path)
    flat_positions_seq1 = flatten_positions(jsonData)
    normalized_seq1 = l2_normalize_sequence(flat_positions_seq1)
    # Initialize a dictionary to hold minimum DTW distances for each part
    min_dtw_distances = {i: float('inf') for i in range(len(flat_positions_seq1) // 2)}
    for file_name in dir_list:
        normalized_seq2 = prepareFile(path + '/' + file_name)
        dtw_distances = calculate_dtw_distance(normalized_seq2, normalized_seq1)
        print(file_name)
        for part_index in range(len(dtw_distances)):
            min_dtw_distances[part_index] = min(min_dtw_distances[part_index], dtw_distances[part_index])
        print(min_dtw_distances)
    result = {
        'min_dtw_distances': min_dtw_distances
    }
    print(json.dumps(result))


if __name__ == "__main__":
    #exc_number_from_node = sys.argv[1]
    main(1)
