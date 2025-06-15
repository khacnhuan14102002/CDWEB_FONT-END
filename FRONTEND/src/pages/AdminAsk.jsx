import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style/AdminAsk.css'; // File CSS riêng nếu có

const AdminAsk = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [productImages, setProductImages] = useState({}); // { maSP: imageUrl }

    useEffect(() => {
        // Lấy danh sách câu hỏi
        axios.get("http://localhost:8080/api/cauhoi")
            .then(res => {
                if (Array.isArray(res.data)) {
                    setQuestions(res.data);
                    // Lấy ảnh sản phẩm tương ứng
                    res.data.forEach(q => {
                        if (q.maSP && !productImages[q.maSP]) {
                            axios.get(`http://localhost:8080/api/sanpham/${q.maSP}`)
                                .then(spRes => {
                                    const imageUrl = spRes.data.hinhAnh;
                                    setProductImages(prev => ({
                                        ...prev,
                                        [q.maSP]: imageUrl
                                    }));
                                    console.log(`Lấy ảnh cho sản phẩm ${q.maSP}:`, imageUrl);
                                })
                                .catch(err => {
                                    console.error(`Lỗi khi lấy sản phẩm ${q.maSP}:`, err);
                                });
                        }
                    });
                } else {
                    console.error("Dữ liệu không phải là mảng:", res.data);
                    setQuestions([]);
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải câu hỏi:", err);
                setQuestions([]);
            });
    }, []);

    const handleAnswerChange = (id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitAnswer = (id) => {
        const answer = answers[id];
        if (!answer) return alert("Vui lòng nhập câu trả lời.");

        axios.post(`http://localhost:8080/api/cauhoi/traloi/${id}`, answer, {
            headers: { 'Content-Type': 'text/plain' }
        })
            .then(() => {
                setQuestions(prev =>
                    prev.map(q => q.id === id ? { ...q, traLoi: answer } : q)
                );
                setAnswers(prev => ({ ...prev, [id]: '' }));
            })
            .catch(err => {
                console.error("Lỗi khi gửi trả lời:", err);
                alert("Có lỗi xảy ra khi gửi câu trả lời.");
            });
    };

    return (
        <div className="container">
            <h2 className="title">Quản lý câu hỏi</h2>

            {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((q) => (
                    <div key={q.id} className="question-box">
                        {/* Hiển thị ảnh sản phẩm */}
                        {productImages[q.maSP] && (
                            <img
                                src={productImages[q.maSP]}
                                alt={`Ảnh sản phẩm ${q.maSP}`}
                                style={{
                                    width: '150px',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    boxShadow: '0 0 5px rgba(0,0,0,0.2)'
                                }}
                            />
                        )}

                        <p><strong>Mã sản phẩm:</strong> {q.maSP}</p>
                        <p><strong>Câu hỏi:</strong> {q.noiDung}</p>
                        <p><strong>Trả lời:</strong> {q.traLoi || "Chưa có câu trả lời."}</p>

                        {!q.traLoi && (
                            <div className="answer-form">
                                <textarea
                                    placeholder="Nhập câu trả lời..."
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                />
                                <button onClick={() => handleSubmitAnswer(q.id)}>Trả lời</button>
                            </div>
                        )}
                        <hr />
                    </div>
                ))
            ) : (
                <p>Không có câu hỏi nào.</p>
            )}
        </div>
    );
};

export default AdminAsk;
