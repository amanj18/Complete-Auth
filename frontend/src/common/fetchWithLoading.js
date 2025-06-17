
export const fetchWithLoading = async (apiCallFn, setLoading) => {
    setLoading(true);
    try {
        const result = await apiCallFn();
        return result;
    } catch (error) {
        // Log the error for debugging
        console.error("Error during API call:", error);
        throw error;
    } finally {
        setLoading(false);
    }
};