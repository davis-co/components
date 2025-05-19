export const safeWatch = (watch,key) => {
    const val = watch(key);
    return val != null ? val.toString() : "";
  };