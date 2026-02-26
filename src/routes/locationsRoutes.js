import { Router } from 'express';
import {
  createLocationController,
  getLocationsController,
  getLocationByIdController,
  updateLocationController,
  deleteLocationController,
  nearbyLocationsController,
} from '../controllers/locationsControllers/indexLocationsControllers.js';

const router = Router();

/**
 * POST /locations - Create a new location
 */
router.post('/', createLocationController);

/**
 * GET /locations - Get all locations with pagination
 */
router.get('/', getLocationsController);

/**
 * GET /locations/nearby - Find locations within a radius from given coordinates (GPS)
 * Query params: latitud (required), longitud (required), radiusKm, limit, offset
 */
router.get('/nearby', nearbyLocationsController);

/**
 * GET /locations/:id - Get single location by ID
 */
router.get('/:id', getLocationByIdController);

/**
 * PUT /locations/:id - Update location
 */
router.put('/:id', updateLocationController);

/**
 * DELETE /locations/:id - Soft delete location
 */
router.delete('/:id', deleteLocationController);

export default router;
