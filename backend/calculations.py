import numpy as np
import nibabel as nib
from skimage import measure
import trimesh

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

def compute_curvature_variability(verts, faces):
    mesh = trimesh.Trimesh(vertices=verts, faces=faces)

    curvature_list = []
    adjacency = mesh.vertex_neighbors

    for i, neighbors in enumerate(adjacency):
        if len(neighbors) < 2:
            continue

        center = verts[i]
        neigh_pts = verts[neighbors]

        dists = np.linalg.norm(neigh_pts - center, axis=1)
        if np.mean(dists) == 0:
            continue

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

    try:
        spacing = img.header.get_zooms()[:3]
    except:
        spacing = (1.0, 1.0, 1.0)

    verts, faces, normals, values = measure.marching_cubes(
        data, 
        level=0.5, 
        step_size=2,
        spacing=spacing
    )

    volume_mm3 = 0.0
    for face in faces:
        p1 = verts[face[0]]
        p2 = verts[face[1]]
        p3 = verts[face[2]]
    
        v_tet = np.dot(p1, np.cross(p2, p3)) / 6.0
        volume_mm3 += v_tet

    vol_cm3 = abs(volume_mm3) / 1000.0

    gfr_estimate = vol_cm3 * 0.8
    safe_creatinine = max(float(creatinine_mg_dl), 0.5) 
    creatinine_factor = 1 / safe_creatinine
    gfr_final = gfr_estimate * creatinine_factor
    dose_mg = 5 * (gfr_final + 25)

    return {
        "volume_cm3": float(round(vol_cm3, 2)),
        "gfr_final": float(round(gfr_final, 2)),
        "dose_mg": float(round(dose_mg, 2)),
        "creatinine": float(creatinine_mg_dl),
        "mesh": {
            "vertices": verts.flatten().tolist(),
            "faces": faces.flatten().tolist()
        }
    }