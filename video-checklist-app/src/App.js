/* App.css：スマホ対応＆かわいく装飾 */

body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', 'Hiragino Kaku Gothic ProN', sans-serif;
  background-color: #fff0f5;
  color: #333;
}

h1 {
  text-align: center;
  color: #ff69b4;
  margin-top: 20px;
  font-size: 24px;
}

.step {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 16px;
  padding: 16px;
  transition: transform 0.2s ease-in-out;
}

.step:hover {
  transform: scale(1.02);
}

label {
  display: block;
  margin-top: 12px;
  font-weight: bold;
  color: #cc3366;
}

input[type="text"], select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

button {
  background-color: #ffb6c1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  margin-top: 12px;
  font-size: 14px;
  cursor: pointer;
}

button:hover {
  background-color: #ff69b4;
}

.progress {
  text-align: center;
  font-size: 18px;
  color: #cc3366;
  margin: 16px;
}

@media screen and (max-width: 480px) {
  h1 {
    font-size: 20px;
  }
  .step {
    margin: 12px;
    padding: 12px;
  }
  input[type="text"], select {
    font-size: 13px;
  }
  button {
    font-size: 13px;
  }
}
