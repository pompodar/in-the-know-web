'use client';
import React, { useState, useEffect } from "react";

const imagesApiUrl = "https://in-the-know.blobsandtrees.online/wp-json/wp/v2/media";

const TestIt = () => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [randomImageIndex, setRandomImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [numberOfCurrentQuestion, setNumberOfCurrentQuestion] = useState(1);

    useEffect(() => {
        fetch(imagesApiUrl)
            .then((response) => response.json())
            .then((data) => {
                const imageUrls = data.map((item) => ({ uri: item.source_url }));
                setImages(imageUrls);
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            });

        fetch("https://in-the-know.blobsandtrees.online/wp-json/custom/v1/question-posts")
            .then((response) => response.json())
            .then((posts) => {
                const filteredQuestions = posts.filter((question) => question?.question);
                setQuestions(shuffleArray(filteredQuestions));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const shuffleArray = (array) => {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    const handleGoPress = () => {
        setCurrentIndex(currentIndex + 1);
        const randomIndex = Math.floor(Math.random() * images.length);
        setRandomImageIndex(randomIndex);
        setShowAnswer(false);
        setNumberOfCurrentQuestion(numberOfCurrentQuestion + 1);

        if (numberOfCurrentQuestion !== questions.length) {
            return;
        } else {
            setNumberOfCurrentQuestion(1);
            setCurrentIndex(0);
        }
    };

    const handleSeeAnswerPress = () => {
        setShowAnswer(true);
    };

    const styles = {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "relative",
            backgroundImage: !showAnswer
                ? `url(${images[randomImageIndex]?.uri})` // Use the URI from the images array
                : questions[currentIndex]?.featured_media
                    ? `url(${questions[currentIndex]?.featured_media?.uri})` // Use the URI from the questions array if available
                    : `url(${images[randomImageIndex]?.uri})` // Otherwise fallback to the random image URI
        },
        grid: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            width: 320, // Adjust width as needed
        },
        card: {
            width: 300,
            height: "auto",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e91e63",
            margin: 5,
            padding: 10,
            borderRadius: 4,
        },
        cardText: {
            fontSize: 14,
            color: "white",
            fontWeight: "bold",
            textIndent: 8,
        },
        button: {
            backgroundColor: "aqua",
            color: "white",
            padding: 8,
            margin: 5,
            borderRadius: 4,
            borderWidth: 0,
            cursor: "pointer",
        },
        pagination: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        paginationText: {
            color: "white",
            fontWeight: "bold",
            fontSize: 12,
            margin: 5,
        }
    };

    const renderCard = () => {
        return (
            <div style={styles.card}>
                <p style={styles.cardText}>
                    {questions[currentIndex]?.question}
                </p>
                <div 
                    style={{
                        marginTop: 20,
                    }}
                >
                    {showAnswer ? (
                        <p style={styles.cardText}>
                            {questions[currentIndex]?.answer}
                        </p>
                    ) : (
                        <button onClick={handleSeeAnswerPress} style={styles.button}>
                            See Answer
                        </button>
                    )}
                </div>
                <div style={styles.pagination}>
                    <p style={styles.paginationText}>
                        {`${numberOfCurrentQuestion}/${questions.length}`}
                    </p>
                </div>
                <button onClick={handleGoPress} style={styles.button}>
                    Next
                </button>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.grid}>{renderCard()}</div>
        </div>
    );
};

export default TestIt;
