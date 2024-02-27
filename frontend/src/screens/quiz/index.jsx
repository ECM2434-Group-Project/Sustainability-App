import React, { useEffect, useState } from "react";
import { AnswerButton } from "../../components/Quiz/AnswerButton";
import { SubmitButton } from "../../components/Quiz/SubmitButton";
import { NextQuizButton } from "../../components/Quiz/NextQuizButton";

export default function Quiz() {

    const [questions, setQuestions] = useState([{
        question: "What is the capital of France?",
        answers: [
            "Paris",
            "London",
            "Berlin",
            "Madrid"
        ]
    },
    {
        question: "How old is Wiktor",
        answers: [
            "18",
            "19",
            "20",
            "21"
        ]
    }])
    const [selected, setSelected] = useState(false)
    const [page, setPage] = useState(0)
    
    useEffect(() => {
        setSelected(false)
    }, [page])

    return page === 0 ? (
        <div className="flex flex-col justify-between h-full p-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Quiz</h1>
                        <p>{questions[0] ? questions[0].question : "not yet loaded in"}</p>
                    </div>

                    {
                        questions[0] ? (
                            questions[0].answers.map((answer, index) => (
                                <AnswerButton key={index} answer={answer} setSelected={setSelected} />
                            ))
                        ) : (
                            <>not loaded in yet</>
                        )
                    }
                </div>

                <div>
                    <NextQuizButton disabled={!selected} setPage={setPage}/>
                </div>
        </div>
            
    ) : (
        <div className="flex flex-col justify-between h-full p-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Quiz</h1>
                        <p>{questions[1] ? questions[1].question : "not yet loaded in"}</p>
                    </div>

                    {
                        questions[1] ? (
                            questions[1].answers.map((answer, index) => (
                                <AnswerButton key={index} answer={answer} setSelected={setSelected} />
                            ))
                        ) : (
                            <>not loaded in yet</>
                        )
                    }
                </div>

                <div>
                    <SubmitButton disabled={!selected} />
                </div>
        </div>
    )
}