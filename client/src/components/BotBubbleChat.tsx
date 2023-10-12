interface Props {
  text: string;
}

const BotBubbleChat: React.FC<Props> = ({ text }) => {
  return (
    <div className=" w-full flex justify-end items-center">
      <div className=" bg-bg_bot w-[100%] xs:w-[70%] rounded-l-xl rounded-tr-xl py-4 px-6">
        <p className=" text-typo font-light ">{text}</p>
      </div>
    </div>
  );
};

export default BotBubbleChat;
