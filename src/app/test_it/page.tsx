'use client';
import React, { useState, useEffect } from "react";
import { CSSProperties } from "react";


const imagesApiUrl = "https://in-the-know.blobsandtrees.online/wp-json/wp/v2/media";

interface Image {
    uri: string;
}

interface Question {
    question: string;
    answer: string;
    featured_media?: Image;
}

const TestIt: React.FC = () => {
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [randomImageIndex, setRandomImageIndex] = useState<number>(0);
    const [images, setImages] = useState<Image[]>([]);
    const [numberOfCurrentQuestion, setNumberOfCurrentQuestion] = useState<number>(1);

    useEffect(() => {
        fetch(imagesApiUrl)
            .then((response) => response.json())
            .then((data: any) => {
                const imageUrls = data.map((item: any) => ({ uri: item.link }));
                setImages(imageUrls);
                console.log(data);
                
            })
            .catch((error) => {
                console.error("Error fetching images:", error);
            });

        fetch("https://in-the-know.blobsandtrees.online/wp-json/custom/v1/question-posts")
            .then((response) => response.json())
            .then((posts: Question[]) => {
                const filteredQuestions = posts.filter((question: Question) => question?.question);
                setQuestions(shuffleArray(filteredQuestions));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const shuffleArray = <T extends unknown>(array: T[]): T[] => {
        let currentIndex = array.length,
            temporaryValue: T,
            randomIndex: number;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    const handleGoPress = (): void => {
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

    const handleSeeAnswerPress = (): void => {
        setShowAnswer(true);
    };

    interface Styles {
        [key: string]: CSSProperties;
    }

    const styles: Styles = {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "relative",
            backgroundImage: !showAnswer
                ? `url(${images[randomImageIndex]?.uri})`
                : questions[currentIndex]?.featured_media
                    ? `url(${questions[currentIndex]?.featured_media?.uri})`
                    : `url(${images[randomImageIndex]?.uri})`
        },
        grid: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            width: 320,
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

    const renderCard = (): JSX.Element => {
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
