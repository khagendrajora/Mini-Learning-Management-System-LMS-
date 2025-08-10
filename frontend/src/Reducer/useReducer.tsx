type ModuleType = {
  title: string;
  description: string;
  files: File[];
  videos: File[];
};

type ModuleAction =
  | { type: "ADD_MODULE"; payload: ModuleType }
  | {
      type: "UPDATE_MODULE_FIELD";
      index: number;
      field: keyof ModuleType;
      value: string | File[];
    }
  | { type: "RESET" };

export const moduleReducer = (
  state: ModuleType[],
  action: ModuleAction
): ModuleType[] => {
  switch (action.type) {
    case "ADD_MODULE":
      return [...state, action.payload];

    case "UPDATE_MODULE_FIELD":
      return state.map((mod, idx) => {
        if (idx !== action.index) return mod;

        const { field, value } = action;

        return {
          ...mod,
          [field]: value,
        };
      });

    case "RESET":
      return [];

    default:
      return state;
  }
};
