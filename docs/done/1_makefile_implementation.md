# Makefile 구현 가이드

## 1. Makefile 생성

### 위치
프로젝트 루트 디렉토리: `/Users/user/WebstormProjects/investment.advenoh.pe.kr/Makefile`

### 파일 내용

```makefile
.PHONY: generate-readme help

# README.md 파일 생성
generate-readme:
	@echo "Generating README.md..."
	@docker run --rm \
		-v $(PWD):/workspace \
		-e WORKSPACE_DIR=/workspace \
		-e CONTENT_DIR=contents \
		-e BLOG_URL=https://investment.advenoh.pe.kr \
		-e PROJECT_TITLE="Frank's Investment Insights Blog" \
		-e HITCOUNT_PATH=kenshin579/investment.advenoh.pe.kr \
		-e NETLIFY_BADGE_ID=359125d0-4402-402d-9168-5b48f60d6a6c \
		kenshin579/readme-generator:latest
	@echo "README.md generated successfully!"

# 도움말 표시
help:
	@echo "Available commands:"
	@echo "  make generate-readme  - Generate README.md using Docker"
	@echo "  make help            - Show this help message"
