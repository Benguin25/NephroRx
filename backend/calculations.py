import numpy as np
import nibabel as nib
from skimage import measure
import trimesh

# ----------------------------------------------------------
# ROUGHNESS SCORE
# ----------------------------------------------------------
def calculate_roughness(verts, faces):
    """
    Roughness = (Actual Surface Area) / (Equivalent Sphere Area)
    ~1.0 = smooth
    >1.5 = likely irregular / tumor
    """
    mesh = trimesh.Trimesh(vertices=verts, faces=faces)

    area = mesh.area
    volume = mesh.volume

    expected_area = (36 * np.pi * (volume ** 2)) ** (1 / 3)

    roughness = area / expected_area
    return round(float(roughness), 2)


# ----------------------------------------------------------
# CURVATURE VARIABILITY INDEX (CVI)
# ----------------------------------------------------------
def compute_curvature_variability(verts, faces):
    mesh = trimesh.Trimesh(vertices=verts, faces=faces)

    curvature_list = []
    adjacency = mesh.vertex_neighbors  # this is a list of lists

    for i, neighbors in enumerate(adjacency):
        if len(neighbors) < 2:
            continue

        center = verts[i]
        neigh_pts = verts[neighbors]

        dists = np.linalg.norm(neigh_pts - center, axis=1)
        if np.mean(dists) == 0:
            continue

        # local curvature approximation
        curvature = np.std(dists) / np.mean(dists)
        curvature_list.append(curvature)

    if len(curvature_list) == 0:
        return {
            "curvature_variability_index": 0.0,
            "mean_curvature": 0.0
        }

    curvature_list = np.array(curvature_list, dtype=float)

    mean_curvature = float(np.mean(curvature_list))
    cvi = float(np.std(curvature_list) / (mean_curvature + 1e-8))

    return {
        "curvature_variability_index": round(cvi, 3),
        "mean_curvature": round(mean_curvature, 3)
    }



def process_seg_file(seg_path, creatinine_mg_dl):

    img = nib.load(seg_path)
    data = img.get_fdata()

    # 1. Safe Spacing
    try:
        spacing = img.header.get_zooms()[:3]
    except:
        spacing = (1.0, 1.0, 1.0)

    # 2. Marching Cubes
    verts, faces, normals, values = measure.marching_cubes(
        data, 
        level=0.5, 
        step_size=2,
        spacing=spacing
    )

    # 3. Volume Calculation (Shoelace / Divergence)
    volume_mm3 = 0.0
    for face in faces:
        v1 = verts[face[0]]
        v2 = verts[face[1]]
        v3 = verts[face[2]]
        volume_mm3 += np.dot(v1, np.cross(v2, v3)) / 6.0

    # 4. Convert to cm3 (mL)
    vol_cm3 = abs(volume_mm3) / 1000.0

    # 5. Pharmacy Logic
    gfr_estimate = vol_cm3 * 0.8
    safe_creatinine = max(float(creatinine_mg_dl), 0.5) # Prevent divide by zero
    creatinine_factor = 1 / safe_creatinine
    gfr_final = gfr_estimate * creatinine_factor
    dose_mg = 5 * (gfr_final + 25)

    # --- THE FIX IS HERE ---
    # We explicitly wrap numbers in float() to fix "Object of type float32 is not JSON serializable"
    return {
        "volume_cm3": float(round(vol_cm3, 2)),
        "gfr_final": float(round(gfr_final, 2)),
        "dose_mg": float(round(dose_mg, 2)),
        "creatinine": float(creatinine_mg_dl),
        "mesh": {
            # flatten() makes it a 1D array [x,y,z, x,y,z], tolist() makes it Python list
            "vertices": verts.flatten().tolist(),
            "faces": faces.flatten().tolist()
        }
    }