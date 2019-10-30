import React from "react";
import useGlobalHook from "use-global-hook";
import * as actions from "../sactions";

const initialGlobalState = {
    user: null,
};

const useGlobal = useGlobalHook(React, initialGlobalState, actions);

export default useGlobal;