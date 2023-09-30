import React, { useState } from "react";
import Panel from "../components/Panel";

const Accordion = () => {
  const [activeTab, setActiveTab] = useState(0);

 const panels = [
   {
     label: "How is this different than OBS?",
     content:
       "Ohmystream is completely in the browser. You do not need to download anything. Additionally, you can stream to multiple services at the same time without the need to download complicated extensions.",
   },
   {
     label: "What are the benefits of multistreaming?",
     content:
       "Multistreaming allows you to grow your audience across multiple platforms at the same time, enables cross-channel discovery and saves you time and money by instantly uploading your content.",
   },
   {
     label: "What custom RTMP destinations do you support?",
     content:
       "We support any RTMP destination that gives you a stream key. For example TikTok, Instagram Live, Dlive, Fansly, or your own personal website.",
   },
   {
     label: "How much does this cost?",
     content:
       "Right now there is a free two-week trial and then it is $10/month. We do not ask for a credit card upfront. If you cannot afford this please reach out to us at ohmystreamer@gmail.com",
   },
   {
     label: "Do you have support?",
     content:
       "Yes, if you have any additional questions or support issues feel free to reach out to us at ohmystreamer@gmail.com",
   },
 ];

  const activateTab = (index) => {
    setActiveTab((prevActiveTab) => (prevActiveTab === index ? -1 : index));
  };

  return (
    <div className="w-80 mx-auto accordion" role="tablist">
      {panels.map((panel, index) => (
        <div
          key={index}
          className={`panel bg-card-background-color mt-3 rounded ${
            activeTab === index ? "border" : ""
          }`}
        >
          <button
            className="panel__label relative block w-full bg-transparent border-none text-left px-6 py-4 font-semibold transition-colors cursor-pointer focus:outline-none text-gray-700"
            onClick={() => activateTab(index)}
          >
            {panel.label}
            <span
              className={`absolute right-6 top-1/2 w-6 h-px mt-px transform ${
                activeTab === index ? "rotate-0" : "rotate-[-90deg]"
              } transition-transform bg-gray-700`}
            ></span>
          </button>
          <div
            className={`panel__inner overflow-hidden transition-height duration-400 ease-in-out ${
              activeTab === index ? "h-auto" : "h-0"
            }`}
            aria-expanded={activeTab === index ? "true" : "false"}
          >
            <div className="panel__content mt-1 mx-6 text-gray-700 text-sm">
              {panel.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
