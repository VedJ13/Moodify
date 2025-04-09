<?php
header('Content-Type: application/json');
require_once 'songs.php';

if (isset($_GET['mood'])) {
    $mood = strtolower($_GET['mood']);
    $recommendations = array_filter($songs, function($song) use ($mood) {
        return $song['mood'] === $mood;
    });
    
    // Shuffle the recommendations to provide variety
    shuffle($recommendations);
    
    // Return the first 5 recommendations
    $recommendations = array_slice($recommendations, 0, 5);
    
    echo json_encode([
        'status' => 'success',
        'recommendations' => array_values($recommendations)
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Mood parameter is required'
    ]);
}
?> 