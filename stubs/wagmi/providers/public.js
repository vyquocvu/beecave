function publicProvider() {
  return {
    id: 'public',
    name: 'Public Provider (shim)',
    priority: 0,
    stallTimeout: 1_000,
    async request() {
      throw new Error('wagmi/providers/public shim was invoked unexpectedly.');
    },
  };
}

module.exports = { publicProvider };
