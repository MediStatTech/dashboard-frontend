.PHONY: run stop envoy dev install gen

# Start everything: envoy + frontend dev server
run: envoy dev

# Install dependencies
install:
	npm install

# Generate proto TypeScript clients
gen:
	npx buf generate

# Start Envoy proxy (background)
envoy:
	docker compose up -d

# Start Vite dev server
dev:
	npm run dev

# Stop Envoy
stop:
	docker compose down
