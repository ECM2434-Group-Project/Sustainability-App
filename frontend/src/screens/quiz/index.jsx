import React, { useEffect, useState } from "react";
import { AnswerButton } from "../../components/Quiz/AnswerButton";
import { SubmitButton } from "../../components/Quiz/SubmitButton";
import { NextQuizButton } from "../../components/Quiz/NextQuizButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

/**
 * the quiz page, shows the user with questions generated by the backend
 * allows the user to answer the questions and submit them to the backend
 * 
 * @returns a quiz page
 */
export default function Quiz({vendorID, latitude, longitude}) {
    // TODO: Remove with the backend questions, restructure to adapt to the backend
    const [questions, setQuestions] = useState([]);

    // state to keep track of if the user has selected an answer
    const [selected, setSelected] = useState(0)

    // which question is the user on
    const [page, setPage] = useState(0)

    const [answers, setAnswers] = useState([]);

    const nav = useNavigate();
    
    useEffect(() => {
        setSelected(0)        
    }, [page]);

    useEffect(() => {
        client.get("/api/quiz").then((response) => {
            setQuestions(response.data);
        })
    }, []);

    useEffect(() => {
        if (answers.length !== 2) {
            return;
        }
        const req = {
            latitude: 50,
            longitude: -3,
            vendor_id: 3,
            quiz: [
                {question_id: questions[0].question_id, answer_id: answers[0]},
                {question_id: questions[1].question_id, answer_id: answers[1]}
            ]
        }
        console.log(JSON.stringify(req));
        client.post("/api/quiz", req).then((response) => {
            if (response.status === 200) {
                nav("/quiz/complete");
            }
        }).catch((error) => {
            console.log(error);
        }
        )
    }, [answers]);

    if (questions.length === 0) {
        return <div>Loading...</div>
    }
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
                                <AnswerButton key={answer.answer_id} index={answer.answer_id}  selected={selected} answer={answer.answer} setSelected={setSelected}/>
                            ))
                        ) : (
                            <>not loaded in yet</>
                        )
                    }
                </div>

                <div>
                    <NextQuizButton disabled={!selected} setPage={setPage} setAnswer={setAnswers} answer={selected}/>
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
                                <AnswerButton key={answer.answer_id} index={answer.answer_id} selected={selected} answer={answer.answer} setSelected={setSelected} />
                            ))
                        ) : (
                            <>not loaded in yet</>
                        )
                    }
                </div>

                <div>
                    <SubmitButton disabled={!selected} setAnswer={setAnswers} answer={selected}/>
                </div>
        </div>
    )
}