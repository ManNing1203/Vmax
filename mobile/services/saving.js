import api from "./api";

export async function setTotalIncomeRequest(totalIncome) {
  try {
    const response = await api.post("/saving/setTotalIncome", { totalIncome });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function setMonthlyIncomeRequest(monthlyIncome) {
  try {
    const response = await api.post("/saving/setMonthlyIncome", {
      monthlyIncome,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function getMonthlyIncomeRequest() {
  try {
    const response = await api.get("/saving/getMonthlyIncome");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

// export async function addSavingsRequest(saving) {
//   const response = await api.post("/saving/addSavings", { saving });
//   return response.data;
// }

// export async function addSavingsByPicRequest(saving) {
//   const response = await api.post("/saving/addSavingsByPic", { saving });
//   return response.data;
// }
