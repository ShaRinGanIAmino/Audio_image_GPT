interface Props {
  text: string;
  audioBlob?: Blob; // Define the audioBlob prop
}

const UserBubbleChat: React.FC<Props> = ({ text, audioBlob }) => {
  return (
    <div className="w-full flex justify-start items-center">
      <div className="bg-bg_user w-[100%] xs:w-[70%] rounded-r-xl rounded-tl-xl py-4 px-6">
        <p className="text-typo font-light">{text}</p>
        {audioBlob && (
          <audio controls>
            <source src={URL.createObjectURL(audioBlob)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default UserBubbleChat;
