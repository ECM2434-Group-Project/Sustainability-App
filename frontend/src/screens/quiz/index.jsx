import React, { useEffect, useState } from "react";
import { AnswerButton } from "../../components/Quiz/AnswerButton";
import { SubmitButton } from "../../components/Quiz/SubmitButton";

export default function Quiz() {

    const [questions, setQuestions] = useState({
        question: "What is the capital of France?",
        answers: [
            "Paris",
            "London",
            "Berlin",
            "Madrid"
        ]
    })
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        console.log("Getting questions")
        setQuestions({
            question: "What is the capital of France?",
            answers: [
                "Paris",
                "London",
                "Berlin",
                "Madrid"
            ]
        })
    }, [])

    return (
        <div className="flex flex-col items-center pt-20">
                <h1 className="text-2xl font-semibold">Quiz</h1>
                <p>{questions ? questions.question : "not yet loaded in"}</p>

                {
                    questions ? (
                        questions.answers.map((answer, index) => (
                            <AnswerButton key={index} answer={answer} setSelected={setSelected} />
                        ))
                    ) : (
                        <>not loaded in yet</>
                    )
                }

                {
                    selected ? (
                        <SubmitButton />
                    ) : (
                        <></>
                    )
                }
        </div>
            
    )
}