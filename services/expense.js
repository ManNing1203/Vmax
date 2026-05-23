import api from "./api";

function normalizeExpense(expense, index = 0) {
  return {
    id: String(
      expense?.id ?? expense?.expenseId ?? expense?.expense_id ?? index,
    ),
    description: expense?.description ?? expense?.title ?? expense?.name ?? "",
    receipt_uri:
      expense?.receipt_uri ??
      expense?.receiptUri ??
      expense?.receiptURL ??
      expense?.receiptUrl ??
      "",
    amount: Number(
      expense?.totalAmount ??
        expense?.total_amount ??
        expense?.amount ??
        expense?.price ??
        0,
    ),
    created_at:
      expense?.created_at ??
      expense?.createdAt ??
      expense?.date ??
      expense?.expense_date ??
      new Date().toISOString().slice(0, 10),
  };
}

function normalizeExpenseList(data) {
  const payload = data?.data ?? data ?? [];
  const list = Array.isArray(payload)
    ? payload
    : (payload?.expenses ?? payload?.items ?? payload?.data ?? []);

  return list.map((expense, index) => normalizeExpense(expense, index));
}

export async function addExpenseRequest(totalAmount, description) {
  const response = await api.post("/expense/addExpense", {
    totalAmount,
    description,
  });

  return response.data;
}

// export async function addExpenseByPicRequest({
//   pic,
//   totalAmount,
//   description,
// }) {
//   const formData = new FormData();

//   formData.append("pic", pic);
//   formData.append("totalAmount", String(totalAmount));

//   if (description !== undefined && description !== null) {
//     formData.append("description", description);
//   }

//   const response = await api.post("/expense/addExpenseByPic", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response.data;
// }

export async function scanExpensePicRequest(pic) {
  const formData = new FormData();
  formData.append("pic", pic);

  const response = await api.post("/expense/scanExpensePic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getExpensesRequest() {
  const response = await api.get("/expense");
  const data = response.data;

  if (data?.success === false) {
    throw new Error(data?.message || "Failed to load expenses.");
  }

  return {
    ...data,
    data: normalizeExpenseList(data),
  };
}
