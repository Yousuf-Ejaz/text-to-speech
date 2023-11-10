import axios from "axios";
import { useState } from "react";

function App() {
	const [text, setText] = useState("");
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const textToSpeech = async (currText: string) => {
		try {
			const API_KEY = import.meta.env.ELEVEN_LABS_API_KEY;

			const speechDetails = await axios.post(
				"https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?optimize_streaming_latency=0&output_format=mp3_44100_128",
				{
					text: currText,
					model_id: "eleven_monolingual_v1",
					voice_settings: {
						stability: 0,
						similarity_boost: 0,
						style: 0,
						use_speaker_boost: true,
					},
				},
				{
					headers: {
						accept: "audio/mpeg",
						"xi-api-key": API_KEY,
						"Content-Type": "application/json",
					},
					responseType: "arraybuffer",
				}
			);

			return speechDetails.data;
		} catch (err) {
			console.log(err);
		}
	};

	const convertHandler = async (inputText: string) => {
		const data = await textToSpeech(inputText);
		const blob = new Blob([data], { type: "audio/mpeg" });
		const url = URL.createObjectURL(blob);
		setAudioURL(url);
	};

	return (
		<>
			<div className="h-screen bg-[#eeeeee] font-['Epilogue'] text-[#333333] flex flex-col justify-center ">
				<div className="font-bold  text-center mb-[1rem] tracking-tight text-4xl">
					Convert from Text to Speech
				</div>
				<textarea
					placeholder="Enter your text here ..."
					className=" mx-auto text-[#bbbbbb] p-4 rounded-md shadow-sm border-none text-xl font-extralight outline-none focus:outline focus:outline-[#666666] focus:outline-4 focus:outline-offset-0 caret-green-500 transition-all duration-100 ease-in"
					rows={5}
					cols={70}
					value={text}
					onChange={(e) => setText(e.target.value)}
				></textarea>
				<div className="flex  max-w-6xl mx-auto gap-8 font-bold ">
					<button
						className="bg-[#333333] text-[#eeeeee] rounded-md py-2 px-4 mt-4 leading-5  uppercase w-36 mx-auto  text-center hover:bg-[#eeeeee] hover:text-[#666666] transition-all duration-300 ease-in-out hover:border-[#666666] border-transparent border-4  "
						onClick={() => convertHandler(text)}
					>
						Convert
					</button>
					<button className="bg-[#333333] text-[#eeeeee] rounded-md py-2 px-4 mt-4 leading-5 uppercase w-36 mx-auto  text-center hover:bg-[#eeeeee] hover:text-[#666666] transition-all duration-300 ease-in-out hover:border-[#666666] border-transparent border-4 ">
						Clear
					</button>
				</div>
				<div className="mt-12 mx-auto shadow-sm rounded-full  ">
					{audioURL && (
						<audio
							controls
							className="w-96 border-4 border-[#333333] bg-white text-[#333333] rounded-full"
						>
							<source src={audioURL} type="audio/mpeg" />
						</audio>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
