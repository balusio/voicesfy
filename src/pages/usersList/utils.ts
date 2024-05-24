enum DATA_TYPES {
  fullName = "fullName",
  firstName = "firstName",
  lastName = "lastName",
  email = "email",
  id = "id",
  image = "image",
}

type TableData = Record<DATA_TYPES, string>;

const formatData = (data: any): TableData[] => {
  return data.map((element: any) => ({
    ...element,
    fullName: `${element.firstName} ${element.lastName}`,
  }));
};

const PAGINATION_RANGE = 13;

const layoutStyles = {
  width: "100%",
  display: "flex",
  "flex-direction": "column",
};

export { PAGINATION_RANGE, formatData, DATA_TYPES };

export type { TableData };
