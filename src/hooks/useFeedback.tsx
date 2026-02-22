import React from "react";

interface IFeedbackProps {}

const useFeedback = () => {
	const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(true);

	return {
		isFeedbackOpen,
		setIsFeedbackOpen,
	};
};

export default useFeedback;
