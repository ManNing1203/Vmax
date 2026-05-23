import api from "./api";

function normalizeAuthResponse(data) {
  const payload = data?.data ?? data ?? {};
  const token =
    payload?.token ??
    payload?.accessToken ??
    payload?.authToken ??
    data?.token ??
    data?.accessToken ??
    data?.authToken ??
    null;
  const success =
    data?.success ??
    payload?.success ??
    (Boolean(token) || Boolean(payload?.user));

  return {
    success,
    message: data?.message ?? payload?.message ?? null,
    token,
    user: payload?.user ?? payload?.account ?? payload?.profile ?? null,
    data: payload,
  };
}

export async function loginRequest(email, password) {
  try {
    const response = await api.post("/user/login", { email, password });
    const result = normalizeAuthResponse(response.data);

    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    return result;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Login failed",
    );
  }
}

export async function registerRequest(email, password) {
  try {
    const response = await api.post("/user/register", { email, password });
    const result = normalizeAuthResponse(response.data);

    if (!result.success) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Registration failed",
    );
  }
}
