VERSION = v0.1.3

.PHONY: build
build:
	docker build -t akesosp/project-informer:$(VERSION) .

