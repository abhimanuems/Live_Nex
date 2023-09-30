import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Panel = ({ label, content, activeTab, index, activateTab }) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const el = ReactDOM.findDOMNode(this);
      const innerEl = el.querySelector(".panel__inner");
      const newHeight = innerEl.scrollHeight;
      setHeight(newHeight);
    }, 333);

    return () => clearTimeout(timeoutId);
  }, []);

  const isActive = activeTab === index;
  const innerStyle = {
    height: `${isActive ? height : 0}px`,
  };

  return (
    <div className="bg-card-background-color mt-3 rounded">
      <button
        className="relative block w-full bg-transparent border-none text-left px-6 py-4 font-semibold transition-colors cursor-pointer focus:outline-none text-gray-700"
        role="tab"
        onClick={activateTab}
        aria-expanded={isActive ? "true" : "false"}
      >
        {label}
        <span
          className={`absolute right-6 top-1/2 w-6 h-px mt-px transform ${
            isActive ? "rotate-0" : "rotate-[-90deg]"
          } transition-transform bg-gray-700`}
        ></span>
      </button>
      <div
        className={`overflow-hidden transition-height duration-400 ease-in-out ${
          isActive ? "h-auto" : "h-0"
        }`}
        aria-hidden={!isActive}
      >
        <p className="mt-1 mx-6 text-gray-700 text-sm">{content}</p>
      </div>
    </div>
  );
};

export default Panel;
