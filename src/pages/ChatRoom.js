import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [participants, setParticipants] = useState(["나"]);
  const [reportedMessages, setReportedMessages] = useState([]);

  useEffect(() => {
    setParticipants(prev => [...prev, "새 친구"]);
  }, []);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "나", text: input }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleReport = (msg, index) => {
    const confirmReport = window.confirm(`"${msg.text}"\n이 메시지를 신고하시겠습니까?`);
    if (confirmReport) {
      setReportedMessages([...reportedMessages, { ...msg, index }]);
      console.warn("🚨 신고된 메시지:", msg);
      alert("신고가 접수되었습니다.");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* 채팅 영역 */}
      <div style={{ flex: 4, display: "flex", flexDirection: "column", padding: "20px" }}>
        <h2>채팅방 #{roomId}</h2>

        {/* 안내 메시지 */}
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
          팀매칭 성공! 대화를 나누어보세요
        </div>

        {/* 메시지 출력 */}
        <div
          style={{
            flex: 1,
            marginTop: "10px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            overflowY: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "10px", display: "flex", flexDirection: "column" }}>
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

                {/* 🚨 신고 버튼 */}
                {msg.sender !== "나" && (
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
          ))}
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





