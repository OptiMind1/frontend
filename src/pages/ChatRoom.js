import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const LANGUAGES = [
  "Korean", "English", "Vietnamese", "Hindi", "Chinese",
  "Japanese", "French", "German", "Spanish", "Arabic"
];

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [participants, setParticipants] = useState(["나"]);
  const [reportedMessages, setReportedMessages] = useState([]);
  const [language, setLanguage] = useState("");
  const [socket, setSocket] = useState(null);
  const chatEndRef = useRef(null);

  // WebSocket 연결
  useEffect(() => {
    const ws = new WebSocket(`wss://yourserver.com/ws/chat/${roomId}/`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    ws.onclose = () => console.warn("🔌 WebSocket closed");
    return () => ws.close();
  }, [roomId]);

  // 자동 스크롤
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 더미 챗봇 응답 생성
  const getBotResponse = (msg) => {
    return `(${language}) 챗봇 응답: ${msg}`;
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const msg = input; // ✅ input 값을 클로저에 고정
    setInput(""); // ✅ 먼저 비워주기

    const userMessage = { sender: "나", text: msg };
    setMessages(prev => [...prev, userMessage]);

    // WebSocket 전송
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(userMessage));
    }

    // 챗봇 응답 (더미)
    setTimeout(() => {
      const botMsg = { sender: "🤖 챗봇", text: getBotResponse(msg) };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ✅ Enter일 때만 기본 동작 방지
      handleSend();
    }
  };

  const handleReport = (msg, index) => {
    const confirmReport = window.confirm(`"${msg.text}"\n이 메시지를 신고하시겠습니까?`);
    if (confirmReport) {
      setReportedMessages([...reportedMessages, { ...msg, index }]);
      alert("신고가 접수되었습니다.");
    }
  };

  if (!language) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>언어를 선택해주세요</h2>
        <select
          onChange={(e) => setLanguage(e.target.value)}
          defaultValue=""
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="" disabled>언어 선택</option>
          {LANGUAGES.map((lang, i) => (
            <option key={i} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* 채팅 영역 */}
      <div style={{ flex: 4, display: "flex", flexDirection: "column", padding: "20px" }}>
        <h2>채팅방 #{roomId}</h2>

        <div style={{
          marginBottom: "20px",
          backgroundColor: "#e6f0ff",
          color: "#003366",
          padding: "15px",
          borderRadius: "10px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "16px"
        }}>
          팀매칭 성공! 대화를 나누어보세요<br />
          🌐 선택한 언어: <strong>{language}</strong>
        </div>

        {/* 메시지 출력 */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            overflowY: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, index) => {
            const isReported = reportedMessages.some(r => r.index === index);
            return (
              <div key={index} style={{ marginBottom: "10px", display: "flex", flexDirection: "column", opacity: isReported ? 0.5 : 1 }}>
                <span style={{ fontSize: "12px", color: "#555" }}>{msg.sender}</span>
                <div
                  style={{
                    alignSelf: msg.sender === "나" ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender === "나" ? "#003366" : "#e0e0e0",
                    color: msg.sender === "나" ? "#fff" : "#000",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    maxWidth: "60%",
                    wordBreak: "break-word",
                    marginTop: "2px",
                    position: "relative"
                  }}
                >
                  {msg.text}

                  {msg.sender !== "나" && msg.sender !== "🤖 챗봇" && (
                    <button
                      onClick={() => handleReport(msg, index)}
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "red",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                      title="이 메시지 신고"
                    >
                      🚩
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* 입력창 */}
        <div style={{ marginTop: "10px", display: "flex" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              marginRight: "10px"
            }}
          />
          <button
            type="button" // ✅ 필수!
            onClick={handleSend}
            style={{
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            전송
          </button>
        </div>
      </div>

      {/* 참여자 리스트 */}
      <div style={{
        flex: 1,
        padding: "20px",
        backgroundColor: "#fff",
        borderLeft: "1px solid #ddd",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.05)"
      }}>
        <h3>참여자</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {participants.map((user, index) => (
            <li key={index} style={{
              padding: "10px 0",
              borderBottom: "1px solid #eee",
              color: "#003366",
              fontWeight: "bold"
            }}>
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatRoom;