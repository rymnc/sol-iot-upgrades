migrate_dev: backend/prisma
	cd backend && npx prisma migrate dev

prisma_studio:
	cd backend && npx prisma studio

prisma_client: backend/prisma
	cd backend && npx prisma generate