import { TypeAnimation } from "react-type-animation";

const Slooogan = () => {
  return (
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        "Pawsitive Care with Purrfect Records",
        2000, // wait 1s before replacing "Mice" with "Hamsters"
        "Where Love Meets Health, Fur Real!",
        2000,
      ]}
      wrapper="p"
      speed={30}
      repeat={Infinity}
      className="slogan"
    />
  );
};

export default Slooogan;
