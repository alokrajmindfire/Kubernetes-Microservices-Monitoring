/**
 * @openapi
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         jobId:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         type:
 *           type: string
 *           example: "primeCalc"
 *         status:
 *           type: string
 *           example: "pending"
 *     JobStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "completed"
 *     Health:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "OK"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-09-23T09:00:00Z"
 *         services:
 *           type: object
 *           properties:
 *             worker:
 *               type: string
 *               example: "running"
 */

/**
 * @openapi
 * /submit:
 *   post:
 *     summary: Submit a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 example: "primeCalc"
 *     responses:
 *       201:
 *         description: Job submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *                 message:
 *                   type: string
 *                   example: "Job submitted successfully"
 *       400:
 *         description: Invalid request body (missing or invalid type)
 */

/**
 * @openapi
 * /status/{id}:
 *   get:
 *     summary: Get the status of a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/JobStatus'
 *                 message:
 *                   type: string
 *                   example: "Jobs status retrieved"
 *       404:
 *         description: Job not found
 */

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Service root info
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service root info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: string
 *                   example: "Service B (metric) is running successfully"
 *                 message:
 *                   type: string
 *                   example: "Service is running"
 */

/**
 * @openapi
 * /health/metrics:
 *   get:
 *     summary: Get service health metrics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Health'
 *                 message:
 *                   type: string
 *                   example: "Service is healthy"
 */
