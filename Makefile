VERSION = v0.1.2

.PHONY: build
build:
	docker build -t akesosp/project-informer:$(VERSION) .

