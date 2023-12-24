using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeshModify_ScaleByCurve : MeshModify
{
    public EffectCurve[] effectCurve = new EffectCurve[1];
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    public override Vector3[] ModifyEffect(Vector3[] vectors, Transform m_transform)
    {
        MeshSize meshSize = GetMeshSize(vectors);
        Vector3[] temp = new Vector3[vectors.Length];
        float t;
        for (int i = 0; i < vectors.Length; i++)
        {
            temp[i] = vectors[i];
            for (int j = 0; j < effectCurve.Length; j++)
            {
                t = GetTonMeshSize(meshSize, temp[i], effectCurve[j].axis);
                temp[i] = effectCurve[j].ScaleVector(temp[i], t);
            }

        }
        return temp;
    }


}

[System.Serializable]
public class EffectCurve
{
    public AnimationCurve curve = new AnimationCurve(new Keyframe[2] { new Keyframe(0, 0), new Keyframe(1, 1) });
    public Axis axis;
    public bool x, y, z;
    public float offset;
    public bool offsetloop;
    public Vector3 ScaleVector(Vector3 v, float t)
    {
        t = t + offset;
        if (offsetloop)
        {
            if (t > 1)
            {
                t = t % 1;
            }
            if (t > 1)
            {
                t = t % 1 + 1;
            }
        }
        float scale = curve.Evaluate(t);
        if (x) { v.x *= scale; }
        if (y) { v.y *= scale; }
        if (z) { v.z *= scale; }
        return v;
    }
}