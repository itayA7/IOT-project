#קריאה לספריות שבשימוש בפרויקט
import json
import os
import numpy as np
from dtw import dtw  # קריאה לספרית DTW
import sys

# Adding custom path to include dtw module
#מיקום שבו ה-Python interpreter  ינסה לייבא את המודלים של הקוד
sys.path.append(r'C:\Users\itaya\AppData\Local\Programs\Python\Python310\Lib\site-packages')

# Maximum DTW distances allowed for each part of each exercise
#מילון המכיל את מספר התרגיל ובתוך כל תרגיל ישנו מילון של כל האיברים ומהו הערך המקסימלי שהם יכולים להיות כדי להיחשב מדויקים
exercise_max_dtw_distances = {
    1: {5: 1.3, 6: 1.3, 7: 1.32, 8: 1.8, 9: 2, 10: 1.8, 11: 0.95, 12: 0.8},
    2: {0: 0.6, 1: 0.8, 2: 0.9},
}


# Function to load keypoints data from a JSON file
#פונקציה המקבלת מיקום של קובץ מסוג json ןמחזירה את תוכן הקובץ
def load_keypoints_from_json(file_path):
    with open(file_path, 'r') as file:
        keypoints_data = json.load(file)
    return keypoints_data


# Manhattan distance calculation between two vectors
def manhattan_distance(x, y):
    return np.sum(np.abs(x - y))


# Euclidean distance calculation between two vectors
def euclidean_distance(x, y):
    return np.sqrt(np.sum((x - y) ** 2))


# Calculate Dynamic Time Warping distance between two sequences
#פונקציה המקבלת שני רצפים של ערכים ומשווה אותם באמצעות אלגוריתם DTW
def calculate_dtw_distance(seq1, seq2):
    distance, _, _, _ = dtw(seq1, seq2, dist=euclidean_distance)
    return distance


# Function to L2 normalize a vector
def l2_normalize(vector):
    vector = np.array(vector)
    norm = np.linalg.norm(vector, ord=2)  # Calculate L2 norm
    normalized_vector = vector / norm if norm != 0 else vector  # Perform normalization, avoid division by zero
    return normalized_vector


# Main function
def main(directory_path, exc_number):
    # Read input keypoints from standard input (stdin)
    input_keypoints = json.loads(sys.stdin.read()) #קובץ הנתונים של המשתמש

    # Initialize minimum DTW distances for each part
    min_dtw_distances = {}
    # Extract unique part numbers
    part_numbers = set(point['part'] for point in input_keypoints[0])

    # Initialize minimum DTW distances for each part
    for part_num in part_numbers:
        min_dtw_distances[part_num] = float('inf') #הגדרת הערך המינימלי של כל חלק לאינסוף

    # Preprocess input keypoints data
    input_sequences = {}
    for part_num in part_numbers:
        input_sequences[part_num] = []
        # Extract keypoints for each part
        for point in input_keypoints:
            for point_data in point:
                if point_data['part'] == part_num:
                    input_sequences[part_num].append([point_data['position']['x'], point_data['position']['y']])

    # L2 normalize input sequences
    input_sequences_normalized = {}
    for part_num in part_numbers:
        input_sequences_normalized[part_num] = l2_normalize(input_sequences[part_num])

    # Iterate through all files in the specified directory
    for file_name in os.listdir(directory_path): #מעבר על כל הקבצים הרלוונטים לתרגיל הנבחר
        if file_name.endswith('.json'):
            file_path = os.path.join(directory_path, file_name)
            keypoints_data = load_keypoints_from_json(file_path) #טעינת הנתונים מהקובץ

            # Preprocess file keypoints data
            file_sequences = {}
            for part_num in part_numbers:
                file_sequences[part_num] = []
            for point in keypoints_data:
                for point_data in point:
                    part_num = point_data['part']
                    if part_num in part_numbers:
                        file_sequences[part_num].append([point_data['position']['x'], point_data['position']['y']])#יצירת מערך לרצף הנקודות של כל איבר

            # L2 normalize file sequences
            file_sequences_normalized = {}
            for part_num in part_numbers:
                file_sequences_normalized[part_num] = l2_normalize(file_sequences[part_num])

            # Calculate DTW distances for each part
            for part_num in part_numbers:
                input_sequence = np.array(input_sequences_normalized[part_num])
                file_sequence = np.array(file_sequences_normalized[part_num])

                dtw_distance = calculate_dtw_distance(input_sequence, file_sequence)#חישוב ערך ה-DTW  של אותו איבר בין הנתונים של המשתמש לנתונים של הקובץ הקיים

                # Update the minimum DTW distance if necessary
                if dtw_distance < min_dtw_distances[part_num]:
                    min_dtw_distances[part_num] = dtw_distance#אם הערך DTW שהקתבל באותו איבר קטן משאר הערכים שהתקבלו לפני אז הוא יוגדר כערך המינימלי לאותו איבר


    # Identify parts performed accurately and inaccurately
    accurate_parts = []
    bad_parts = []
    for part_num in part_numbers: #ריצה על כל האיברים
        #אם הערך המנימנלי קטן מהערך שמוגדר במילון אז נוסיף את האיבר לרשימת האיברים "המדוקים"
        if min_dtw_distances[part_num] <= exercise_max_dtw_distances[exc_number][part_num]:
            accurate_parts.append(part_num)
        else:
            bad_parts.append(part_num)

    result = {
        'min_dtw_distances': min_dtw_distances,
        'accurate_part': accurate_parts,
        'not_accurate_part': bad_parts
    }
    # Print result as JSON to standard output (stdout)
    print(json.dumps(result))


if __name__ == "__main__":
    # Read exercise number from command-line arguments
    exc_number_from_node = sys.argv[1] #מספר התרגיל שהתקבל מהשרת
    # Construct directory path based on exercise number
    directory_path = 'E:/מכללה/IOT/final project-2024/python ml/keypoints_json/exc' + str(exc_number_from_node)
    # Call main function with the provided directory path and exercise number
    main(directory_path, int(exc_number_from_node))