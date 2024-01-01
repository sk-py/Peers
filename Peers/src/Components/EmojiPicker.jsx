import EmojiPicker from "emoji-picker-react";

function EmojiComp({ setmessage, message }) {
  // console.log("message from emoji comp", message);
  // console.log("setmessage from emoji comp", setmessage);
  return (
    <div className="absolute hidden bottom-16 " id="emojiComp">
      <EmojiPicker
        theme="dark"
        onEmojiClick={(emoji) =>
          setmessage((prevMessage) => prevMessage + emoji.emoji)
        }
      />
    </div>
  );
}

export default EmojiComp;
