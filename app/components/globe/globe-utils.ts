import * as THREE from 'three'

export const GLOBE_RADIUS = 2

/**
 * Convert geographic lat/lon (degrees) to a THREE.Vector3 on a sphere.
 * Uses the (lon + 180) offset so the prime meridian starts at +x,
 * which means Asia-Pacific occupies the +z hemisphere — facing the camera
 * at (0, 0, 5.5) when the globe is given an initial y-rotation of Math.PI.
 */
export function latLonToXYZ(lat: number, lon: number, r = GLOBE_RADIUS): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  )
}

/** Melbourne — the destination */
export const MELBOURNE = latLonToXYZ(-37.8, 144.9)

/** Asia-Pacific source cities whose arcs flow toward Melbourne */
export const SOURCE_CITIES = [
  { name: 'Singapore',    pos: latLonToXYZ(1.3,   103.8) },
  { name: 'Hong Kong',    pos: latLonToXYZ(22.3,  114.2) },
  { name: 'Shanghai',     pos: latLonToXYZ(31.2,  121.5) },
  { name: 'Tokyo',        pos: latLonToXYZ(35.7,  139.7) },
  { name: 'Kuala Lumpur', pos: latLonToXYZ(3.1,   101.7) },
  { name: 'Beijing',      pos: latLonToXYZ(39.9,  116.4) },
]
