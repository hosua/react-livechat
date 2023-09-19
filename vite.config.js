import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 42072,
		proxy: {
			"/livechat/api": {
				target: "http://127.0.0.1:3003",
				changeOrigin: true,
				secure: false,
			}
		}
	}
})
